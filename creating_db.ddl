CREATE DATABASE akeno_debug; 

CREATE TABLE `akeno_debug`.`users`( 
    `id` INT(5) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(64) NOT NULL,
    `dscr_id` VARCHAR(64) NOT NULL,
    `server_fk` INT(5) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

CREATE TABLE `akeno_debug`.`servers`(
    `id` INT(5) NOT NULL AUTO_INCREMENT,
    `dscr_id` VARCHAR(64) NOT NULL,
    /* when instantiating table leave this as null.
    otherwise, you cant insert anything to the table as this becomes loop - 
    server requires user and user requires server*/
    `admin_fk` INT(5) NULL,
    `server_conf_fk` INT(5) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

CREATE TABLE `akeno_debug`.`server_conf`(
    `id` INT(5) NOT NULL AUTO_INCREMENT,
    `admin_role` VARCHAR(32) NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

CREATE TABLE `akeno_debug`.`user_stats`(
    `id` INT(5) NOT NULL AUTO_INCREMENT,
    `user_fk` INT(5) NOT NULL,
    `pats` INT(5) NOT NULL DEFAULT '0',
    `thanks` INT(5) NOT NULL DEFAULT '0',
    `honors` INT(5) NOT NULL DEFAULT '0',
    `spare_honors` INT(32) NOT NULL DEFAULT '15',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

ALTER TABLE `akeno_debug`.`users` ADD FOREIGN KEY (`server_fk`) REFERENCES `akeno_debug`.`servers`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `akeno_debug`.`servers` ADD FOREIGN KEY (`admin_fk`) REFERENCES `akeno_debug`.`users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `akeno_debug`.`servers` ADD FOREIGN KEY (`server_conf_fk`) REFERENCES `akeno_debug`.`server_conf`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `akeno_debug`.`user_stats` ADD FOREIGN KEY (`user_fk`) REFERENCES `akeno_debug`.`users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;


INSERT INTO `akeno_debug`.`server_conf` (`id`, `admin_role`) VALUES (NULL, 'AkenoDev');
INSERT INTO `akeno_debug`.`servers` (`id`, `dscr_id`, `admin_fk`, `server_conf_fk`) VALUES (NULL, '414414057060433920', NULL, '1');
INSERT INTO `akeno_debug`.`users` (`id`, `name`, `dscr_id`, `server_fk`) VALUES (NULL, 'Akeno', '429672169203695616', '1');
INSERT INTO `akeno_debug`.`user_stats` (`id`, `user_fk`, `pats`, `thanks`, `honors`, `spare_honors`) VALUES (NULL, '1', DEFAULT, DEFAULT, DEFAULT, DEFAULT);
/* After inserting all rows, update server admin_fk */
UPDATE `akeno_debug`.`servers` SET `admin_fk` = '1' WHERE `akeno_debug`.`servers`.`id` = 1 


/* Image storing */

CREATE TABLE `akeno_debug`.`images`(
    `id` INT(5) NOT NULL AUTO_INCREMENT,
    `server_fk` INT(5) NOT NULL,
    `name` VARCHAR(32) NOT NULL,
    `url` VARCHAR(32) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

ALTER TABLE `akeno_debug`.`images` ADD FOREIGN KEY (`server_fk`) REFERENCES `akeno_debug`.`servers`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;